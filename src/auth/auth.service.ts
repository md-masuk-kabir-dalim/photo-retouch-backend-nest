/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './auth.schema';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private readonly mailerService: MailerService,
  ) {}

  /*************************************** signup ****************************************************/
  async signup(req) {
    try {
      const uniqueMail = await this.authModel.findOne({ email: req.email });
      if (!uniqueMail) {
        req.hash = bcrypt.hashSync(req.password, 8);
        delete req.password;
        const user = new this.authModel(req);
        console.log('user created', user);
        await user.save();
        return user;
      } else {
        console.log('user already exists');
        throw new NotFoundException('User already exists');
      }
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
  /*************************************** signin ****************************************************/
  async signin(email, password) {
    try {
      try {
        const userExist = await await this.authModel.findOne({ email });
        if (!userExist) {
          console.log('not exist');
          throw new NotFoundException('User Does not Exist');
        } else {
          if (!bcrypt.compareSync(password, userExist.hash)) {
            console.log('wrong password');
            throw new NotFoundException('Wrong Password');
          }
          const token = jwt.sign({ email: userExist.email }, 'secret', {
            expiresIn: '10h',
          });

          const user = {
            userExist,
            token,
          };
          console.log(user);
          return user;
        }
      } catch (error) {
        console.log('LOGIN ERROR', error);
        if (error.error === 'Not Found') {
          throw new NotFoundException(error.error);
        } else {
          throw new NotFoundException(error.message);
        }
      }
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /*************************************** forget password ****************************************************/

  async forgetPassword(email) {
    let result = await this.authModel.findOne({ email });
    console.log('email----', result);
    if (Object.keys(result).length == 0) {
      console.log('Invalid Email');
      throw new NotFoundException('Invalid Email');
    }

    try {
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: '"photo retouch" <tezeract.test@outlook.com>', // sender address
        subject: 'Reset your password', // Subject line
        text: '', // plaintext body
        html: `<body style="
        background-color: #e9ecef;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      ">
    <!-- start preheader -->
    <div class="preheader" style="
          display: none;
          max-width: 0;
          max-height: 0;
          overflow: hidden;
          font-size: 1px;
          line-height: 1px;
          color: #fff;
          opacity: 0;
        ">
        Reset your password
    </div>
    <!-- end preheader -->

    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
          border-collapse: collapse !important;
        ">
       
        <tr>
            <td align="center" bgcolor="#e9ecef" style="
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              mso-table-rspace: 0pt;
              mso-table-lspace: 0pt;
            ">
              
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="
                max-width: 600px;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
                border-collapse: collapse !important;
              ">
                    <tr>
                        <td align="center" valign="top" style="
                    padding: 36px 24px;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  ">
                   
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
            </td>
        </tr>
       
        <tr>
            <td align="center" bgcolor="#e9ecef" style="
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              mso-table-rspace: 0pt;
              mso-table-lspace: 0pt;
            ">
                <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="
                max-width: 600px;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
                border-collapse: collapse !important;
              ">
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="
                    padding: 36px 24px 0;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    border-top: 3px solid #d4dadf;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  ">
                            <h1 style="
                      margin: 0;
                      font-size: 32px;
                      font-weight: 700;
                      letter-spacing: -1px;
                      line-height: 48px;
                    ">
                                Reset your password
                            </h1>
                        </td>
                    </tr>
                </table>
        
            </td>
        </tr>
  
        <tr>
            <td align="center" bgcolor="#e9ecef" style="
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              mso-table-rspace: 0pt;
              mso-table-lspace: 0pt;
            ">
              
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="
                max-width: 600px;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
                border-collapse: collapse !important;
              ">
                    <!-- start copy -->
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="
                    padding: 24px;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  ">
                            <p style="margin: 0">
                               A request has been made to reset your password. If you did not make this request, please ignore this email.
                            </p>
                        </td>
                    </tr>
                    <!-- end copy -->

                    <!-- start button -->
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  ">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="
                      -ms-text-size-adjust: 100%;
                      -webkit-text-size-adjust: 100%;
                      mso-table-rspace: 0pt;
                      mso-table-lspace: 0pt;
                      border-collapse: collapse !important;
                    ">
                                <tr>
                                    <td align="center" bgcolor="#ffffff" style="
                          padding: 12px;
                          -ms-text-size-adjust: 100%;
                          -webkit-text-size-adjust: 100%;
                          mso-table-rspace: 0pt;
                          mso-table-lspace: 0pt;
                        ">
                                        <table border="0" cellpadding="0" cellspacing="0" style="
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                            mso-table-rspace: 0pt;
                            mso-table-lspace: 0pt;
                            border-collapse: collapse !important;
                          ">
                                            <tr>
                                                <td align="center" bgcolor="#1a82e2" style="
                                border-radius: 6px;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                                mso-table-rspace: 0pt;
                                mso-table-lspace: 0pt;
                              ">
                                                    <a href="https://alisia.ai/auth/new-password"
                                                        target="_blank" style="
                                  display: inline-block;
                                  padding: 16px 36px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 16px;
                                  color: #ffffff;
                                  text-decoration: none;
                                  border-radius: 6px;
                                  -ms-text-size-adjust: 100%;
                                  -webkit-text-size-adjust: 100%;
                                ">Reset password</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- end button -->

                    <!-- start copy -->
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="
                    padding: 24px;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  ">
                            <p style="margin: 0">
                                If that doesn't work, copy and paste the following link in
                                your browser:
                            </p>
                            <p style="margin: 0">
                                <a href="https://alisia.ai/auth/new-password" target="_blank" style="
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                        color: #1a82e2;
                      ">https://alisia.ai/auth/new-password</a>
                            </p>
                        </td>
                    </tr>
                    <!-- end copy -->

                    <!-- start copy -->
                    <tr>
                        <td align="left" bgcolor="#ffffff" style="
                    padding: 24px;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                    border-bottom: 3px solid #d4dadf;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  ">
                            <p style="margin: 0">
                                Thank you,<br />
                                The photo retouch Team
                            </p>
                        </td>
                    </tr>
                    <!-- end copy -->
                </table>
                <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
            </td>
        </tr>
        <!-- end copy block -->

        <!-- start footer -->
        <tr>
            <td align="center" bgcolor="#e9ecef" style="
              padding: 24px;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
              mso-table-rspace: 0pt;
              mso-table-lspace: 0pt;
            ">
                <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="
                max-width: 600px;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
                border-collapse: collapse !important;
              ">
                    <!-- start permission -->
                    <tr>
                        <td align="center" bgcolor="#e9ecef" style="
                    padding: 12px 24px;
                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                    font-size: 14px;
                    line-height: 20px;
                    color: #666;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  ">
                            <p style="margin: 0">
                                You received this email because we received a request for
                                reset password on photo retouch. If you didn't request reset password
                                email you can safely delete this email.
                            </p>
                        </td>
                    </tr>
                    <!-- end permission -->
                </table>
                <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
            </td>
        </tr>
        <!-- end footer -->
    </table>
    <!-- end body -->
</body>`,
        // <h3>https://play.google.com/store/apps/details?id=com.mozaicweb.buspect&hl=en_US&gl=GB</h3>`, // HTML body content
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          msg: 'Email does not exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    throw new HttpException(
      {
        status: HttpStatus.OK,
        msg: 'Password Recovery link sent to your email',
      },
      HttpStatus.OK,
    );
  }

  /*************************** Update Password ***************************/
  async updatePassword(email, newPassword) {
    console.log('params', email, newPassword);
    let user = await this.authModel.findOne({ email });
    console.log(user);
    if (user) {
      // let passwordMatched = await bcrypt.compareSync(password, user.hash);
      let hashedPassword = await bcrypt.hashSync(newPassword, 8);

      await this.authModel.findOneAndUpdate(
        { email },
        { hash: hashedPassword },
      );
      throw new HttpException(
        {
          status: HttpStatus.OK,
          msg: 'Password Changed Successfully',
        },
        HttpStatus.OK,
      );
    } else {
      throw new NotFoundException('user not found');
    }
  }

  // async updatePassword(email, password, newPassword) {
  //   console.log('params', email, password, newPassword);
  //   let user = await this.authModel.findOne({ email });
  //   console.log(user);
  //   if (user) {
  //     let passwordMatched = await bcrypt.compareSync(password, user.hash);
  //     let hashedPassword = await bcrypt.hashSync(newPassword, 8);

  //     if (passwordMatched) {
  //       await this.authModel.findOneAndUpdate(
  //         { email },
  //         { hash: hashedPassword },
  //       );
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.OK,
  //           msg: 'Password Changed Successfully',
  //         },
  //         HttpStatus.OK,
  //       );
  //     } else {
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.BAD_REQUEST,
  //           error: 'Incorrect password',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   } else {
  //     throw new NotFoundException('user not found');
  //   }
  // }
  /*************************************** reset password ****************************************************/
  async resetPassword(email, pass) {
    console.log('email', email, pass);
    const userExist = await this.authModel.findOne({ email }).exec();
    console.log('userExist', userExist);
    if (!userExist) {
      console.log('not exist');
      throw new NotFoundException('User Does not Exist');
    }

    if (userExist) {
      let hashedPassword = await bcrypt.hashSync(pass, 8);

      await this.authModel.findOneAndUpdate(
        { email },
        { hash: hashedPassword },
      );
      throw new HttpException(
        {
          status: HttpStatus.OK,
          msg: 'Password Changed Successfully',
        },
        HttpStatus.OK,
      );
    } else {
      throw new NotFoundException('user not found');
    }
  }

  /*************************************** edit profile****************************************************/
  async editProfile(userId, userData) {
    console.log(userId, userData);
    let updatedUser;
    let response;
    try {
      updatedUser = await this.authModel.findById(userId);
    } catch (err) {
      throw new NotFoundException('User does not exist');
    }
    console.log('updatedUser', updatedUser);
    const newUser = {
      ...updatedUser._doc,
      ...userData,
    };

    if (userData?.password) {
      newUser.hash = await bcrypt.hashSync(userData.password, 8);
    }

    try {
      response = await await this.authModel.findByIdAndUpdate(userId, newUser, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });
    } catch (err) {
      throw new NotFoundException('User not Found');
    }

    console.log('response', response);
    const user = {
      userExist: response,
    };
    console.log('user', user);

    return user;
  }

  /*************************************** get all users ****************************************************/
  async getAllUsers() {
    try {
      const totalUsers = await this.authModel.find();
      console.log('total users', totalUsers.length);
      if (totalUsers.length > 0) {
        return totalUsers;
      } else {
        throw new NotFoundException('No users Exists');
      }
    } catch (error) {
      console.log(error);
      throw [404, error.message];
    }
  }

  /*************************************** delete user ****************************************************/
  async deleteUser(userId) {
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      const userExists = await this.authModel.findById(userId).exec();
      console.log('user found', userExists);
      if (userExists) {
        await this.authModel.findByIdAndDelete(userId);
        return 'User Deleted successfully';
      } else {
        throw new NotFoundException('not found');
      }
    } else {
      throw new BadRequestException('Invalid user id');
    }
  }
}
