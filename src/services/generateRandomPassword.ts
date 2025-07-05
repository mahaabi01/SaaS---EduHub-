import bcrypt from 'bcrypt'

const generateRandomPassword = (teacherName:string) => {
  const randomNumber = Math.floor(1000 + Math.random() * 90000)
  const passwordData = {
    hashedVersion: bcrypt.hashSync(`${randomNumber}_${teacherName}`, 10), // to save this hased version into database
    plainPassword: `${randomNumber}_${teacherName}` // to send mail to the user
  }
  return passwordData
}

export default generateRandomPassword;