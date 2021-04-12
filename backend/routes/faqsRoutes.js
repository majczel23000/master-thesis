import faq from '../controllers/faqController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainFaqsRouter = require('express').Router();

MainFaqsRouter.route('/')
    .post(verifyToken, checkRoleAndStatus(roles.faqs.create), faq.createFaq)
    .get(faq.getAllFaqs);
MainFaqsRouter.route('/:id')
    .get(verifyToken, checkRoleAndStatus(roles.faqs.getId), faq.getFaqById)
    .delete(verifyToken, checkRoleAndStatus(roles.faqs.delete), faq.deleteFaq)
    .put(verifyToken, checkRoleAndStatus(roles.faqs.update), faq.updateFaq);
MainFaqsRouter.route('/:id/activate')
    .post(verifyToken, checkRoleAndStatus(roles.faqs.update), faq.activate);
MainFaqsRouter.route('/:id/deactivate')
    .post(verifyToken, checkRoleAndStatus(roles.faqs.update), faq.deactivate);

module.exports = MainFaqsRouter;