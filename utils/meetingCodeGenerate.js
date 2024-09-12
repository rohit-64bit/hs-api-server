const otpGenerator = require('otp-generator');
const Meetings = require('../models/Meetings');
meetingCodeGenerate = async () => {

    const link = otpGenerator.generate(9, { upperCase: false, specialChars: false });

    const code = link.substring(0, 3) + '-' + link.substring(3, 6) + '-' + link.substring(6, 9);

    const validateLink = await Meetings.findOne({ link: code });

    if (validateLink) {
        return meetingCodeGenerate();
    }

    return code;

}

module.exports = meetingCodeGenerate;