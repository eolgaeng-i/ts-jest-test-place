import {callOrPrice, formatBytes, numberWithCommas, under} from "../index";

describe('numberWithCommas', () => {
  it('NaN을 인자로 넣었을 경우 0을 반환해야 한다.', () => {
    expect(numberWithCommas(NaN)).toBe(0);
  });

  it('문자열을 인자로 넣었을 경우 그 문자열 그대로 반환해야 한다.', () => {
    expect(numberWithCommas('4')).toMatch('4');
  });

  it('comma가 필요없는 작은 수가 들어온 경우 그대로 반환한다.', () => {
    expect(numberWithCommas(4)).toMatch('4');
  });

  it('1000이상의 큰 수를 인자로 넣었을 경우 ,를 포함하여 반환한다', () => {
    expect(numberWithCommas(4000)).toMatch('4,000');
  });
});

describe('under', () => {
  const bigN = 10000;
  const smallN = 55;

  it('null을 인자로 넣었을 경우 0을 반환해야 한다.', () => {
    expect(under(null, 100)).toBe(0);
  });

  it('max없이 999보다 큰 수를 인자로 넣었을 경우 999+를 반환한다.', () => {
    expect(under(bigN)).toBe('999+');
  });

  it('max없이 999보다 작은 수를 인자로 넣었을 경우 인자를 그대로 반환한다.', () => {
    expect(under(smallN)).toBe(smallN);
  });

  it('max가 있고 max보다 큰 수를 인자로 넣었을 경우 ${max}+를 반환한다.', () => {
    expect(under(bigN, 9999)).toBe('9999+');
  });

  it('max가 있고 max보다 작은 수를 인자로 넣었을 경우 인자를 그대로 반환한다.', () => {
    expect(under(bigN, bigN + 1)).toBe(bigN);
  });
});

describe('formatBytes', () => {
  const size = 1024;
  const type = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const data = {
    'Bytes': 1,
    'KB': size,
    'MB': Math.pow(size,2),
    'GB': Math.pow(size,3),
    'TB': Math.pow(size,4),
    'PB': Math.pow(size,5),
    'EB': Math.pow(size,6),
    'ZB': Math.pow(size,7),
    'YB': Math.pow(size,8)
  };

  const decimals = 99;
  it('0을 인자로 넣은 경우 "0 Bytes"를 반환한다.', () => {
    expect(formatBytes(0)).toMatch('0 Bytes');
  });

  Object.keys(data).map((key) => {
    const idx = Math.floor(Math.log(data[key]) / Math.log(size));

    it(`인자 값이 ${data[key]}이고 no decimals일 때 소숫점 없는 값 + 단위를 반환한다.`, () => {
      expect(formatBytes(data[key])).toMatch(`${parseFloat((data[key] / Math.pow(size, idx)).toFixed(0))}.${type[idx]}`)
    });

    it(`인자 값이 ${data[key]}이고 decimals이 있을 때 소숫점${decimals}자리의 값 + 단위를 반환한다.`, () => {
      expect(formatBytes(data[key], decimals)).toMatch(`${parseFloat((data[key] / Math.pow(size, idx)).toFixed(99))}.${type[idx]}`)
    })
  });
});

describe('callOrPrice', () => {
  const shortNum = 500;
  const shortNumString = '500';
  const longNum = 500000;
  const longNumString = '500,000';
  const suffix = 'w2r3s3';

  it('is_call값이 true인 경우 다른 인자값에 상관없이 "전화문의"를 반환해야한다', () => {
    expect(callOrPrice(true, longNum, 'asdf')).toMatch('전화문의');
  });

  it('is_call값이 false이고 price가 0인 경우 "무료"를 반환해야한다', () => {
    expect(callOrPrice(false, 0)).toMatch('무료');
  });

  it('is_call값이 false이고 price가 1000보다 작은 값인 경우 string으로 변환된 price값을 반환해야한다', () => {
    expect(callOrPrice(false, shortNum)).toMatch(shortNumString);
  });

  it('is_call값이 false, price가 1000보다 작은 값이고 suffix 값이 존재하는 경우 `${price}${suffix}`를 반환해야한다', () => {
    expect(callOrPrice(false, shortNum, suffix)).toMatch(shortNumString + suffix);
  });

  it('is_call값이 false, price가 1000보다 크거나 같은 값인 경우 comma가 포함된 price 문자열을 반환해야한다', () => {
    expect(callOrPrice(false, longNum)).toMatch(longNumString);
  });

  it('is_call값이 false, price가 1000보다 크거나 같은 값이고 suffix 값이 존재하는 경우 `${comma가 포함된 price값}${suffix}`문자열을 반환해야한다', () => {
    expect(callOrPrice(false, longNum, suffix)).toMatch(longNumString + suffix);
  });
});