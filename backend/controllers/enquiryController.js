import { enquiryService } from '../services/enquiryService.js';
import { requireFields } from '../utils/validate.js';

export const enquiryController = {
  async create(req, res, next) {
    try {
      requireFields(req.body, ['kind', 'name']);
      res.status(201).json(await enquiryService.create(req.body));
    } catch (e) {
      next(e);
    }
  },
};
