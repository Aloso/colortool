const path = require('path')

const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

module.exports = [
    {
        entry: './app/index.ts',
        target: 'web',
        mode,
        devtool,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    "sourceMap": !isProduction,
                                },
                            },
                        }
                    ],
                },
            ],
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ],
        },
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, 'out', 'public'),
        }
    },
]