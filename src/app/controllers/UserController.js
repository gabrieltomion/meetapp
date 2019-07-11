import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const scheme = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().min(6),
      confirmPassword: Yup.string().min(6),
    });

    /**
     * Check if data is valid
     */
    if (!(await scheme.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if user exists
     */
    const { email } = req.body;
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exist' });
    }

    /**
     * Check if password equals confirm_password
     */
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    const { id, name } = await User.create(req.body);
    return res.json({ id, email, name });
  }
}

export default new UserController();
