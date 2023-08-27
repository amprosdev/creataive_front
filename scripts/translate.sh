formatjs extract 'src/constants/strings.js*' --out-file src/locales/message.json --format scripts/format.js --id-interpolation-pattern '[sha512:contenthash:base64:6]'
formatjs compile src/locales/message.json --out-file src/locales/zh.json --format scripts/format.js
formatjs compile src/locales/message.json --out-file src/locales/en.json --format scripts/format.js
rm -rf src/locales/message.json
