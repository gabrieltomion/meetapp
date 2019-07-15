import * as Yup from 'yup';
import { isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      meetupId: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { meetupId } = req.body;
    const participantId = req.userId;

    const meetup = await Meetup.findByPk(meetupId);

    if (meetup.organizer_id === participantId) {
      return res.status(400).json({ error: 'You are organizer this meetup' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Date is before' });
    }

    const alreadyASubscriber = await Subscription.findOne({
      where: { participant_id: participantId, meetup_id: meetup.id },
    });

    if (alreadyASubscriber) {
      return res.status(400).json({ error: 'Already a subscriber' });
    }

    const subscription = await Subscription.create({
      participant_id: req.userId,
      meetup_id: meetup.id,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
