import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        meetup_id: Sequelize.INTEGER,
        participant_id: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
}

export default Subscription;
