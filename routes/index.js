import channelRoutes from './channels.js';
import reviewRoutes from './reviews.js';
import userRoutes from './users.js';


const constructorMethod = (app) => {
  app.use('/channels', channelRoutes);
  app.use('/users', userRoutes);
  app.use('/reviews', reviewRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;