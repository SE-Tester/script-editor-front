const I18nAmplifier = require('./i18n.parse');
const path = require('path');
const SRC_PATH = path.join(__dirname, '..', 'src');
const DIST_PATH = path.join(__dirname, '..', 'src', 'assets', 'locales');
const TXT_FILES_PATH = path.resolve(__dirname, '');

const NEED_EXTRACT = process.env.NEED_EXTRACT;
const NEED_IMPORT = process.env.NEED_IMPORT;
const VALIDATE = process.env.VALIDATE;

const classObject = new I18nAmplifier({
  fileName: 'interface.json',
  sourcePath: SRC_PATH,
  languages: ['ru', 'en'],
  localePath: DIST_PATH,
  needExtract: NEED_EXTRACT || false,
  validate: false,
  needImport: NEED_IMPORT || false,
  fileFormat: 'tsx',
  textPath: TXT_FILES_PATH,
});
try {
  classObject.parseLanguages();
} catch (e) {
  console.log(e);
}
