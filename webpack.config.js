try {
	require("os").networkInterfaces();
} catch (e) {
	require("os").networkInterfaces = () => ({});
}

const path = require("path");
const webpack = require("webpack");
const { resolve } = require("path");

module.exports = {
	entry: {
		client: [
			"babel-polyfill",
			"./client.js"
		]
	},
	devtool: "source-map",
	output: {
		publicPath: "/public/",
		path: path.join(__dirname, "public/"),
		filename: "[name].js"
	},
	target: "web",
	resolve: {
		extensions: [".jsx", ".js", ".json"]
	},
	module: {
		loaders: [
			{
				test: /\.(js|jsx)?$/,
				exclude: /(node_modules)/,
				loader: "babel-loader"
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			__DEBUG__: JSON.stringify(JSON.parse(process.env.DEBUG || "false"))
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true
			},
			output: {
				comments: false
			}
		})
	]
};
