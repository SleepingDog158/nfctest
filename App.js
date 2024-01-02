import React, {useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import NfcManager, {NfcTech} from "react-native-nfc-manager";
import emv from "node-emv";

// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {
	const [cardInfo, setCard] = useState({});
	const [cardHolderName, setHolderName] = useState("");
	const readNdef = async () => {
		try {
			NfcManager.cancelTechnologyRequest();
		} catch (error) {}

		try {
			const commands = [
				"00A404000E325041592E5359532E444446303100",
				"00A4040007A000000003101000",
				"80A80000238321F620C00000000000000100000000000007240000000000097823112300194E172C00",
				"80A800002383212800000000000000000000000000000002500000000000097820052600E8DA935200",
				"80CA9F1700",
				"80CA9F3600",
				"00A4040007A00000000410100E",
				"80A8000002830000",
				"00B2011400",
				"00B2010C00",
				"00B2012400",
				"00B2022400",
			];

			await NfcManager.requestTechnology([NfcTech.IsoDep]);
			console.log("---start---");
			const responses = [];

			for (let i = 0; i < commands.length; i++) {
				const resp = await NfcManager.isoDepHandler.transceive(
					toByteArray(commands[i]),
				);
				responses.push(resp);
			}

			if (responses && responses.length > 2) {
				const r = await getEmvInfo(toHexString(responses[2]));
				console.log(r);
				if (r) {
					const cardInfo = getCardInfoVisa(r);
					if (cardInfo) {
						console.log(cardInfo);
						setCard(cardInfo);
					} else {
						return null;
					}
				} else {
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			return null;
		} finally {
			NfcManager.cancelTechnologyRequest();
		}
	};

	const getEmvInfo = (info) => {
		return new Promise((resolve) => {
			emv.describe(info, (data) => {
				if (data) {
					console.log(data[0].value);
					resolve(data);
				} else {
					resolve(null);
				}
			});
		});
	};

	const toByteArray = (text) => {
		return text.match(/.{1,2}/g).map((b) => {
			return parseInt(b, 16);
		});
	};

	const toHexString = (byteArr) => {
		return byteArr.reduce((acc, byte) => {
			return acc + ("00" + byte.toString(16).toUpperCase()).slice(-2);
		}, "");
	};

	const hexDecode = (data) => {
		let result = "";
		for (let i = 0; i < data?.length; i += 2) {
			if (data.substring(i, i + 4) === "2020") break;
			result += String.fromCharCode(parseInt(data.substring(i, i + 2), 16));
		}
		return result;
	};
	const getCardInfoVisa = (responses) => {
		let res;
		for (let i = 0; i < responses.length; i++) {
			const r = responses[i];
			if (r.tag === "77" && r.value && r.value.length > 0) {
				for (let j = 0; j < r.value.length; j++) {
					const e = r.value[j];
					if (e.tag === "57" && e.value) {
						const parts = e.value.split("D");
						if (parts.length > 1) {
							setCard({
								...cardInfo,
								card: parts[0].match(/.{1,4}/g).join(" "),
								exp: `${parts[1].substring(0, 4).substring(2, 4)}/${parts[1]
									.substring(0, 4)
									.substring(0, 2)}`,
							});
						}
					}
					if (e.tag === "5F20" && e.value) {
						console.log(hexDecode(e.value));

						setHolderName(hexDecode(e.value));
					}
				}
			}
		}
		return res;
	};

	return (
		<View style={styles.wrapper}>
			<TouchableOpacity
				onPress={readNdef}
				style={{
					height: 48,
					backgroundColor: "blue",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					margin: 4,
				}}>
				<Text style={{color: "white"}}>Scan a Tag</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => setCard({})}
				style={{
					height: 48,
					backgroundColor: "orange",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					margin: 4,
				}}>
				<Text style={{color: "white"}}>reset</Text>
			</TouchableOpacity>
			{cardInfo?.card && (
				<View
					style={{
						flex: 1,
						width: "100%",
					}}>
					<View
						style={{
							height: 220,
							backgroundColor: "#b8b8b8",
							borderRadius: 12,
							marginHorizontal: 12,
							paddingHorizontal: 24,
							justifyContent: "flex-end",
							paddingVertical: 16,
						}}>
						<Text style={{fontSize: 26, color: "white"}}>{cardInfo?.card}</Text>
						<Text style={{fontSize: 20, color: "white", textAlign: "center"}}>
				EXP {cardInfo.exp}
						</Text>
						<Text style={{fontSize: 22, color: "white"}}>{cardHolderName}</Text>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white",
	},
});

export default App;
