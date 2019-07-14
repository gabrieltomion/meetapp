import * as Yup from 'yup';
import { isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if date is before
     */
    const { title, description, location, date, banner } = req.body;

    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Date is before' });
    }

    const meetupCreated = await Meetup.create({
      title,
      description,
      location,
      date,
      banner_id: banner,
      organizer_id: req.userId,
    });

    return res.json(meetupCreated);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const meetup = await Meetup.findOne({
      where: {
        id,
        organizer_id: req.userId,
      },
    });

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    /**
     * Check if date has passed
     */
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Date of the meetup has passed' });
    }

    const updatedMeetup = await meetup.update(req.body);

    return res.json(updatedMeetup);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const meetups = await Meetup.findAll({
      where: {
        organizer_id: req.userId,
      },
      attributes: ['id', 'title', 'description', 'location', 'date'],
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

  async delete(req, res) {
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        organizer_id: req.userId,
      },
    });

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Date of the meetup has passed' });
    }

    meetup.destroy();

    return res.status(200).json({
      deleted: true,
      id: req.params.id,
    });
  }
}

export default new MeetupController();
