import Mail from '../../lib/Mail';

class SubscriberMeetupMail {
  get key() {
    return 'SubscriberMeetupMail';
  }

  async handle({ data }) {
    const { subscriber, meetup } = data;

    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: `Novo inscrito no Meetup (${meetup.title})`,
      template: 'subscriber_meetup',
      context: {
        organizerName: meetup.organizer.name,
        meetupTitle: meetup.title,
        subscriberName: subscriber.name,
        subscriberEmail: subscriber.email,
      },
    });
  }
}

export default new SubscriberMeetupMail();
