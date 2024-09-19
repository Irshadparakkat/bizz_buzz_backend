import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  async sendWelcomMessageDriver(data: {
    username: string;
    userphone: string;
    password: string;
  }): Promise<boolean> {
    console.log(
      `Driver added with number ${data.userphone} and password ${data.password}`,
    );
    const url = `${process.env.SMS_URL}${process.env.SMS_KEY}/ADDON_SERVICES/SEND/TSMS`;
    const params = new URLSearchParams({
      TemplateName: process.env.WELCOME_DRIVER,
      To: data.userphone,
      From: process.env.SMS_FROM,
      ctid: process.env.SMS_CID_DRIVER,
      VAR1: data.username,
      VAR2: data.userphone,
      VAR3: data.password,
      VAR4: process.env.APP_LINK_DRIVER,
      VAR5: '',
    });

    const res = axios
      .post(url, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => {
        return response ? true : false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    return res;
  }

  async sendWelcomMessageBusiness(data: {
    username: string;
    userphone: string;
    password: string;
  }): Promise<boolean> {
    console.log(
      `Business added with number ${data.userphone} and password ${data.password}`,
    );
    const url = `${process.env.SMS_URL}${process.env.SMS_KEY}/ADDON_SERVICES/SEND/TSMS`;
    const params = new URLSearchParams({
      TemplateName: process.env.WELCOME_BUSINESS,
      To: data.userphone,
      From: process.env.SMS_FROM,
      ctid: process.env.SMS_CID_BUSINESS,
      VAR1: data.username,
      VAR2: data.userphone,
      VAR3: data.password,
      VAR4: process.env.APP_LINK_BUSINESS,
    });

    const res = axios
      .post(url, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => {
        return response ? true : false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    return res;
  }

  async sendOtp(to: string): Promise<string> {
    const otp = this.generateRandom4DigitNumber();
    const url = `${process.env.SMS_URL}${process.env.SMS_KEY}/SMS/${to}/${otp}/${process.env.OTP_TEMPLATE}`;
    const res = await axios
      .get(url)
      .then((response) => {
        return response ? otp : 'error';
      })
      .catch((error) => {
        console.log(error);
        return 'error';
      });
    return otp;
  }

  generateRandom4DigitNumber() {
    // Generate random decimal between 0 and 1
    const randomDecimal = Math.random();

    // Multiply by 10000 to get a number between 0 and 9999.9999...
    const randomNumber = randomDecimal * 10000;

    // Floor the number to remove decimals and get an integer
    const randomInteger = Math.floor(randomNumber);

    // Return the 4-digit number
    return randomInteger.toString().padStart(4, '0');
  }
}
