const I18nAmplifier = require('./i18n.parse');
const path = require('path');
const SRC_PATH = path.join(__dirname, '..', 'src');
const DIST_PATH = path.join(__dirname, '..', 'src', 'assets', 'locales');
const TXT_PATH = path.join(__dirname, 'locales');

describe('i18n amplifier tests', () => {
  it('EXPORT_I18N', async () => {
    const classObject = new I18nAmplifier({
      fileName: 'interface.json',
      sourcePath: SRC_PATH,
      languages: ['ru', 'en'],
      localePath: DIST_PATH,
      txtPath: TXT_PATH,
      needExtract: true,
      validate: false,
      fileFormat: 'tsx',
    });
    const resp = await classObject.parseLanguages();
    console.log(resp);
    expect(true).toEqual(true);
  });
  it('IMPORT_I18N', async () => {
    const classObject = new I18nAmplifier({
      fileName: 'interface.json',
      sourcePath: SRC_PATH,
      languages: ['ru', 'en'],
      localePath: DIST_PATH,
      txtPath: TXT_PATH,
      needExtract: false,
      needImport: true,
      validate: false,
      fileFormat: 'tsx',
    });
    const resp = await classObject.parseLanguages();
    console.log(resp);
    expect(true).toEqual(true);
  });
  it('WATCH_I18N', async () => {
    const classObject = new I18nAmplifier({
      fileName: 'interface.json',
      sourcePath: SRC_PATH,
      languages: ['ru', 'en'],
      localePath: DIST_PATH,
      txtPath: TXT_PATH,
      needExtract: false,
      needImport: false,
      validate: true,
      fileFormat: 'tsx',
    });
    const resp = await classObject.parseLanguages();
    console.log(resp);
    expect(true).toEqual(true);
  });
});
