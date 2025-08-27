import { Injectable } from '@nestjs/common';
import snowflake from 'snowflake-id';
import { v1 as uuid } from 'uuid';

@Injectable()
export class GeneratorService {
  private snowflakeId: snowflake = ((_machineId = 1) => {
    return new snowflake({
      mid: _machineId,
      offset: (2021 - 1970) * 31536000 * 1000,
    });
  })();

  public generateSnowflakeId(): string {
    return this.snowflakeId.generate();
  }

  public uuid(): string {
    return uuid();
  }

  public fileName(ext: string): string {
    return this.uuid() + '.' + ext;
  }

  public generateRandomToken(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return token;
  }

  public generateRandomTransactionCode(length: number): string {
    const characters = '0123456789';
    const charactersLength = characters.length;
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return token;
  }

  public generateRandomPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const allChars = uppercase + lowercase + numbers;
  
    let password = '';
  
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
  
    // Generate remaining 5 characters randomly
    for (let i = 3; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
  
    // Shuffle the password to randomize positions
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
