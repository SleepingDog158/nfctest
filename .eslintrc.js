module.exports = exports = {
	"settings": {
		"react": {
		  	"version": "detect"
		}
	},
	"env": {
		"browser": true,
		"es2021": true,
		"react-native/react-native": true,
		"jest": true,
	},
	"extends": [
		"prettier",
		"prettier/react",
		"plugin:react/recommended",
	],
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true,
		},
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": ["react", "react-native"],
	"rules": {
		// Các quy tắc
		// Định dạng và cú pháp
		"indent": [2, "tab"],
		"no-tabs": 0, // Thụt lề 2 ký tự
		"quotes": ["error", "double"], // Sử dụng dấu nháy đơn
		"semi": ["error", "always"], // Luôn sử dụng dấu chấm phẩy

		// Biến và khai báo
		"no-unused-vars": "warn", // Cảnh báo khi có biến không sử dụng
		"no-undef": "error", // Báo lỗi khi sử dụng biến không được định nghĩa

		// ES6+ và module
		"arrow-parens": ["error", "always"], // Luôn đặt dấu ngoặc đơn cho tham số của hàm mũi tên
		"no-var": "error", // Không sử dụng var
		"prefer-const": "error", // Ưu tiên sử dụng const thay vì let khi có thể

		// React
		"react/jsx-uses-react": "error",
		"react/jsx-uses-vars": "error",
		"react/react-in-jsx-scope": "error",
	},
};
