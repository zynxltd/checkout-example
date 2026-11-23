export default class AuthService {
    demoEmail;
    demoPassword;
    constructor(demoEmail, demoPassword) {
        this.demoEmail = demoEmail;
        this.demoPassword = demoPassword;
    }
    validate(input) {
        const errors = [];
        const email = input.email.trim();
        const password = input.password;
        if (!email)
            errors.push('Email is required.');
        if (!password)
            errors.push('Password is required.');
        if (!errors.length && (email !== this.demoEmail || password !== this.demoPassword)) {
            errors.push('Credentials do not match the demo account.');
        }
        return errors;
    }
    authenticate() {
        return {
            email: this.demoEmail,
            name: 'Demo operator',
        };
    }
}
