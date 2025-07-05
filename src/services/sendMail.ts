import nodemailer from 'nodemailer'

interface IMailInformation {
  to: string,
  subject:string,
  text: string
}
const sendMail = async (mailInformation: IMailInformation) => {
  // mail sending logic 
  // step 1: create nodemailer Transport
  // transporter/transport ---> transport configuration setup 
  // auth --> sender gmail password 

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_GMAIL,
      pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD // not real password but app password which is provided by gmail obtianed from google setting and app password option
    }
  })

  const mailFormatObject = {
    from: "EduHub<mahaabi01@gmail.com",
    to: mailInformation.to,
    subject: mailInformation.subject,
    text: mailInformation.text
    }
    
  try{
  await transporter.sendMail(mailFormatObject)
  }catch(error){
    console.log("Error:", error)
  }
}

export default sendMail