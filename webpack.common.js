const os = require('os');
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
	entry: {
		'.phoenix.js': './src/phoenix.ts'
	},
	output: {
		path: os.homedir(),
		filename: '[name]',
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				include: path.resolve(__dirname, 'src'),
				options: {
					transpileOnly: true,
				},
			},
		],
	},
	plugins: [
		new webpack.ProgressPlugin(),
		new ForkTsCheckerWebpackPlugin(),
	],
};
