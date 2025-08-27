import snowflake from 'snowflake-id';
import { createHash } from 'crypto';
import slugify from 'slugify';

export interface Resource {
  filename: string;
  type: string;
}
export const generateSnowflakeId = () => {
  const snowflakeId = new snowflake({
    mid: 1,
    offset: (2021 - 1970) * 31536000 * 1000,
  });
  return snowflakeId.generate();
};

export const generateUrlResource = ({ type, filename }: Resource) => {
  return `/common/${type}/${filename}`;
};

export const generateExportResource = ({ filename }: Resource) => {
  return `/common/excels/${filename}`;
};

export const md5 = (_string) => createHash('md5').update(_string).digest('hex');

export const vietnameseMap: { [key: string]: string } = {
  Đ: 'D',
  đ: 'd',
  À: 'A',
  Á: 'A',
  Ạ: 'A',
  Ả: 'A',
  Ã: 'A',
  ạ: 'a',
  à: 'a',
  á: 'a',
  ã: 'a',
  ả: 'a',
  a: 'a',
  ă: 'a',
  â: 'a',
  e: 'e',
  i: 'i',
  o: 'o',
  u: 'u',
  y: 'y',
  ó: 'o',
  ò: 'o',
  ệ: 'e',
};

export const generateSlug = (title: string) => {
  // Tùy chỉnh việc thay thế các ký tự tiếng Việt
  title = title
    .split('')
    .map((char) => vietnameseMap[char] || char)
    .join('');

  return slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
};

