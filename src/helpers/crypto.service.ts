import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from './../config/config.service';
import SimpleCrypto from "simple-crypto-js";
import * as CryptoJS from 'crypto-js';
import env from '../config/env.util';

@Injectable()
export class CryptoService {

  private simpleCrypto: SimpleCrypto;

  private hashService: any;

  private appSecret: string;

  constructor(private config?: ConfigService) {
    this.appSecret = (config) ? config.get('APP_SECRET') : env.APP_SECRET;
    this.simpleCrypto = new SimpleCrypto(this.appSecret);
    this.hashService = require('object-hash');
  }

  /**
   * Encrypt data
   *
   * @param data object | string | number | boolean
   * @param secret string
   */
  public encrypt(data: object | string | number | boolean, secret?: string): string {
    if (secret) {
      this.simpleCrypto.setSecret(secret);
    }
    return this.simpleCrypto.encrypt(data);
  }

  /**
   * Decrypt data
   *
   * @param ciphered string
   * @param secret string | null
   * @param expectsObject boolean
   * @param enc CryptoJS.Encoder
   */
  public decrypt(ciphered: string, secret?: string, expectsObject: boolean = false, enc: CryptoJS.Encoder = CryptoJS.enc.Utf8): string | object {
    if (secret) {
      this.simpleCrypto.setSecret(secret);
    }
    return this.simpleCrypto.decrypt(ciphered, expectsObject, enc);
  }

  public generateRandom(length: number = 128, expectsWordArray: boolean = false): string | CryptoJS.WordArray {
    return SimpleCrypto.generateRandom(length, expectsWordArray);
  }

  public hash(data: object | string | number | boolean, options?: object): string {
    return this.hashService(data, options);
  }

  public getSecret(): string {
    return this.appSecret || "";
  }

}
