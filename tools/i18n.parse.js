const fs = require('fs');

const _ = require('lodash');
const path = require('path');

function I18nException(lang, item, file) {
  this.sourceFile = file;
  this.language = lang;
  this.i18nKey = item;
  this.name = 'where is the tranlsation 😰 ? ugleplastic';
}

function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

const fileReadAsync = (file, execFunc) =>
  new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      const fileData = data.toString();
      resolve(execFunc(fileData));
    });
  });
/**
 *
 * @param {string[]} keys
 * @param {string} file
 */
const importI18n = async (keys, file, exportFile) => {
  const data = await fileReadAsync(file, (data) => data.split('\n'));
  const kv = {};
  for (let i = 0; (i < keys.length) & (i < data.length); i++) {
    _.set(kv, keys[i], data[i]);
  }
  fs.writeFile(exportFile, JSON.stringify(kv, 0, 2));
};
/**
 *
 */
const extractI18n = async (valuesList, file) => {
  const data = valuesList.join('\n');
  fs.writeFile(file, data, { encoding: 'utf8' });
};

// const i18nAmplifier = async (config) => {
//   const store = [];
//   const files =;
//   for (let file of files) {
//     const data = await fileReadAsync(file, parseString);
//     data.map((item) => {
//       store.push({ key: item[0].replace(`'`, '').replace(`'`, ''), file });
//     });
//   }
//
//   for (let lang of config.languages) {
//     const exportArr = [];
//
//     const data = JSON.parse(
//       await fileReadAsync(
//         path.join(config.localePath, lang, config.fileName),
//         (data) => data,
//       ),
//     );
//
//     for (const storeItem of [...new Set(store)]) {
//       if (!_.get(data, storeItem, undefined)) {
//         if (config.check) {
//           return I18nException(lang, storeItem.key, storeItem.file);
//         } else {
//           _.set(data, storeItem.key, 'unhandled translation');
//         }
//       } else {
//         exportArr.push(_.get(data, storeItem));
//       }
//     }
//     if (config.needExtract)
//       await extractI18n(
//         exportArr,
//         path.join(config.localePath, config.exportFile),
//       );
//
//     fs.writeFile(
//       path.join(config.localePath, lang, config.fileName),
//       JSON.stringify(data, 0, 2),
//       (err) => {
//         if (err) {
//           console.log(err);
//         }
//       },
//     );
//   }
// };

/**
 * @typedef I18nConfig
 * @property {string[]} languages
 * @property {string} localePath
 * @property {string} fileName
 * @property {string} exportText
 * @property {boolean} needExtract
 * @property {needImport} needImport
 * @property {string} sourcePath
 * @property {boolean} validate
 * @property {'js'|'jsx'|'tsx'} fileFormat
 * */

class I18nAmplifier {
  /**
   *
   * @param {I18nConfig} config
   */
  constructor(config) {
    this.config = config;
    this.keys = [];
    this.values = [];
    this.files = getFiles(config.sourcePath).filter((x) =>
      x.match('.*.' + this.config.fileFormat),
    );
  }

  /**
   * Parse languages
   * @returns {Promise<boolean>}
   */
  async parseLanguages() {
    const sourceKeys = await this.parseSources();
    const uniqueSource = [
      ...new Map(sourceKeys.map((item) => [item.key, item])).values(),
    ];
    for (const lang of this.config.languages) {
      const langFile = path.join(
        this.config.localePath,
        lang,
        this.config.fileName,
      );
      const localeStruct = await this.readLocale(langFile);
      const exportKeys = [];
      const exportValues = [];
      if (this.config.needImport) {
        const { keys, values } = await this.importLocale(lang);
        for (let i = 0; i < keys.length; i++) {
          _.set(localeStruct, keys[i], values[i]);
        }
        fs.writeFile(langFile, JSON.stringify(localeStruct, 0, 2), (err) => {
          if (err) console.log(err);
        });
      } else {
        for (const { key, file } of uniqueSource) {
          const valueObject = await this.validate(
            key,
            localeStruct,
            file,
            lang,
          );
          if (!valueObject) {
            _.set(localeStruct, key, 'default');
          } else {
            exportKeys.push(key);
            exportValues.push(valueObject);
          }
        }
        if (this.config.needExtract)
          await this.extract(
            exportKeys.join('\n'),
            exportValues.join('\n'),
            lang,
            'keys.txt',
            'values.txt',
          );

        fs.writeFile(langFile, JSON.stringify(localeStruct, 0, 2), (err) => {
          if (err) console.log(err);
        });
      }
    }
  }

  async importLocale(importPath) {
    console.log(path.join(__dirname, importPath, 'keys.txt'));
    return {
      keys: await fileReadAsync(
        path.join(__dirname, importPath, 'keys.txt'),
        (e) => e.split('\n'),
      ),
      values: await fileReadAsync(
        path.join(__dirname, importPath, 'values.txt'),
        (e) => e.split('\n'),
      ),
    };
  }

  /**
   * validate localeObjectStruct with key of source file
   * @param {string} key
   * @param {Object} struct
   * @param {string} file
   * @param {string} lang
   * @returns {Promise<boolean>}
   */
  async validate(key, struct, file, lang) {
    const object = _.get(struct, key, undefined);
    if (!object) {
      if (this.config.validate) throw new I18nException(lang, key, file);
    }
    return object;
  }

  async readLocale(file) {
    return fileReadAsync(file, (data) => JSON.parse(data));
  }

  /**
   * parse source files
   * @returns {Promise<Array<{key:string,file:string}>>}
   */
  async parseSources() {
    const exportArray = [];
    for (const file of this.files) {
      const source = await this.parseSource(file);
      for (const src of source) exportArray.push(src);
    }
    return exportArray;
  }

  async checkSourceKey(sourceKey) {}

  async compareWithLocale(localeFile) {}

  /**
   *
   */
  async extract(keys, values, lang, keyFile, valueFile) {
    fs.writeFile(path.join(__dirname, lang, keyFile), keys, (err) => {
      if (err) {
        console.log(err);
      }
    });
    fs.writeFile(path.join(__dirname, lang, valueFile), values, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  /**
   * Parse tsx files to extract i18n keys
   * @param {string} file
   * @returns {Array<{key:string,file:string}>}
   */
  async parseSource(file) {
    const sourceFileKeys = await fileReadAsync(file, I18nAmplifier.findByRegex);
    const arr = [];
    for (const sourceKey of sourceFileKeys) {
      arr.push({ key: sourceKey, file });
    }
    return arr;
  }

  /**
   * Function to extract files by regex
   * @param data
   * @returns {[]}
   */
  static findByRegex = (data) => {
    const matches = data.matchAll(`\\bt\\(.*\\)`);
   
    const sourceArray = [];
    for (const match of matches) {
      
      try {
        if (match && match[0]) {
          const matchObject = match[0];
          const inlineMatch = matchObject
            .match(`'.*'`)[0]
            .replace(`'`, '')
            .replace(`'`, '');
          sourceArray.push(inlineMatch);
        }
      } catch (e) {
        //TODO: optimize try catch block
        console.log(e);
      }
    }
    return sourceArray;
  };
}

module.exports = I18nAmplifier;
