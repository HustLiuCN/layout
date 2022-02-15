const path = require('path')

const webpackConfig = {
	mode: process.env.NODE_ENV || 'production',
	// watch: true,
	entry: {
		word: './src/word',
		line: './src/line',
		fisheye: './src/fisheye',
		wave: './src/wave',
	},
	output: {
		filename: '[name].build.js',
		path: path.resolve(__dirname, './demos/dist'),
	},
	// TODO
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
			}, {
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
				],
			}, {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
		]
	},
	resolve: {
		extensions: ['.js', '.json', '.ts'],
		alias: {
			'@data': path.resolve(__dirname, './mock-data'),
			'@style': path.resolve(__dirname, './style'),
			'@lib': path.resolve(__dirname, './lib'),
			'@src': path.resolve(__dirname, './src'),
		},
	},
	devtool: 'sourcemap',
}

module.exports = webpackConfig
