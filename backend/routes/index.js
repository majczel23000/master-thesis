export default (app) => {
    // USERS
    app.use('/users', require('./usersRoutes'));
    // ROLES
    app.use('/roles', require('./rolesRoutes'));
    // FAQS
    app.use('/faqs', require('./faqsRoutes'));
    // MENUS
    app.use('/menus', require('./menusRoutes'));
    // PAGES
    app.use('/pages', require('./pagesRoutes'));
    // IMAGES
    app.use('/images', require('./imagesRoutes'));
    // SETTINGS
    app.use('/settings', require('./settingsRoutes'));
    // DICTIONARIES
    app.use('/dictionaries', require('./dictionariesRoutes'));
    // CAROUSELS
    app.use('/carousels', require('./carouselsRoutes'));
};

