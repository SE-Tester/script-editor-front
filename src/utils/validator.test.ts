import validator from './validator';
import RentalPhoneInput from '../components/RentalPhoneInput';
import React from 'react';

describe('form validator test', () => {
  describe('validate String', () => {
    it('value is  True', () => {
      expect(validator.withString(-100)('data')).toBe(true);
    });
    it('validate string False', () => {
      expect(validator.withString()(10)).toBe(false);
    });
    it('validate string False with params', () => {
      expect(
        validator.withString(10)(new Array(12).fill(null).map((a) => 'A')),
      ).toBe(false);
    });
  });
  describe('validate Number', () => {
    it('value is  True', () => {
      expect(validator.withNumber(-100)(10)).toBe(true);
    });
    it('validate number False', () => {
      expect(validator.withNumber(-100, 50)(51)).toBe(false);
    });
  });
  describe('validate Required', () => {
    it('value is  True', () => {
      expect(validator.withRequired()(10)).toBe(true);
    });
    it('validate string False', () => {
      expect(validator.withRequired()(undefined)).toBe(false);
    });
  });

  describe('validate functions', () => {
    it('some', () => {
      const toNumber = (s: string): string => s.replace(/\D/g, '');
      expect(toNumber('+7 (927) 471-80-01')).toBe('79274718001');
    });
    it('mask', () => {
      const toNumber = (s: string): string => s.replace(/\D/g, '');
      const withMask = (value: string, mask: string) => {
        let phoneIndex = 0;
        let phoneValue = toNumber(value);
        return mask
          .split('')
          .map((item, idx) => {
            return item === '0'
              ? phoneValue[phoneIndex++]
              : idx < value.length
              ? item
              : undefined;
          })
          .filter((item) => item)
          .join('');
      };
      expect(withMask('+7 (927)-80-01', '+0 (000) 000-00-00')).toBe(
        '+7 (927) 800-1',
      );
    });

    it('value is  True', () => {
      const model = validator.pipe(
        validator.validate(
          'ks',
          'err',
          validator.withRequired(),
          validator.withNumber(10),
        ),
      )({ values: { ks: 4 } });
      expect(Object.keys(model.errors).length).toBe(1);
    });
    it('validate string False', () => {
      const model = validator.pipe(
        validator.validate(
          'ks',
          'err',
          validator.withRequired(),
          validator.withNumber(40, 100),
        ),
      )({ values: { ks: 52 } });
      expect(Object.keys(model.errors).length).toBe(0);
    });
  });
});
