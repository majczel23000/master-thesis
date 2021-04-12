let MongoClient = require('mongodb').MongoClient;
import Role from '../models/roleModel.js';

module.exports = {
    createRoles: function() {
        let date = new Date();
        let roles = [
            { code: 'USERS/GET_ALL', name: 'Get all users', description: 'Get all users', createdAt: date, status: 'ACTIVE'},
            { code: 'USERS/GET_ID', name: 'Get specified user', description: 'Get specified user', createdAt: date, status: 'ACTIVE' },
            { code: 'USERS/CREATE', name: 'Create user', description: 'Create user', createdAt: date, status: 'ACTIVE' },
            { code: 'USERS/UPDATE', name: 'Update user', description: 'Update user', createdAt: date, status: 'ACTIVE' },
            { code: 'USERS/DELETE', name: 'Delete user', description: 'Delete user', createdAt: date, status: 'ACTIVE' },
            { code: 'ROLES/GET_ALL', name: 'Get all roles', description: 'Get all roles', createdAt: date, status: 'ACTIVE' },
            { code: 'ROLES/GET_ID', name: 'Get specified roles', description: 'Get specified role', createdAt: date, status: 'ACTIVE' },
            { code: 'ROLES/UPDATE', name: 'Update role', description: 'Update role', createdAt: date, status: 'ACTIVE' },
            { code: 'FAQS/GET_ALL', name: 'Get all faqs', description: 'Get all faqs', createdAt: date, status: 'ACTIVE'},
            { code: 'FAQS/GET_ID', name: 'Get specified faq', description: 'Get specified faq', createdAt: date, status: 'ACTIVE' },
            { code: 'FAQS/CREATE', name: 'Create faq', description: 'Create faq', createdAt: date, status: 'ACTIVE' },
            { code: 'FAQS/UPDATE', name: 'Update faq', description: 'Update faq', createdAt: date, status: 'ACTIVE' },
            { code: 'FAQS/DELETE', name: 'Delete faq', description: 'Delete faq', createdAt: date, status: 'ACTIVE' },
            { code: 'MENUS/GET_ALL', name: 'Get all menus', description: 'Get all menus', createdAt: date, status: 'ACTIVE'},
            { code: 'MENUS/GET_ID', name: 'Get specified menu', description: 'Get specified menu', createdAt: date, status: 'ACTIVE' },
            { code: 'MENUS/CREATE', name: 'Create menu', description: 'Create menu', createdAt: date, status: 'ACTIVE' },
            { code: 'MENUS/UPDATE', name: 'Update menu', description: 'Update menu', createdAt: date, status: 'ACTIVE' },
            { code: 'MENUS/DELETE', name: 'Delete menu', description: 'Delete menu', createdAt: date, status: 'ACTIVE' },
            { code: 'PAGES/GET_ALL', name: 'Get all pages', description: 'Get all pages', createdAt: date, status: 'ACTIVE'},
            { code: 'PAGES/GET_ID', name: 'Get specified page', description: 'Get specified page', createdAt: date, status: 'ACTIVE' },
            { code: 'PAGES/CREATE', name: 'Create page', description: 'Create page', createdAt: date, status: 'ACTIVE' },
            { code: 'PAGES/UPDATE', name: 'Update page', description: 'Update page', createdAt: date, status: 'ACTIVE' },
            { code: 'PAGES/DELETE', name: 'Delete page', description: 'Delete page', createdAt: date, status: 'ACTIVE' },
            { code: 'IMAGES/GET_ALL', name: 'Get all images', description: 'Get all image', createdAt: date, status: 'ACTIVE'},
            { code: 'IMAGES/GET_ID', name: 'Get specified images', description: 'Get specified image', createdAt: date, status: 'ACTIVE' },
            { code: 'IMAGES/CREATE', name: 'Create image', description: 'Create image', createdAt: date, status: 'ACTIVE' },
            { code: 'IMAGES/UPDATE', name: 'Update image', description: 'Update image', createdAt: date, status: 'ACTIVE' },
            { code: 'IMAGES/DELETE', name: 'Delete image', description: 'Delete image', createdAt: date, status: 'ACTIVE' },
            { code: 'SETTINGS/GET_ALL', name: 'Get all settings', description: 'Get all settings', createdAt: date, status: 'ACTIVE'},
            { code: 'SETTINGS/GET_ID', name: 'Get specified setting', description: 'Get specified setting', createdAt: date, status: 'ACTIVE' },
            { code: 'SETTINGS/CREATE', name: 'Create setting', description: 'Create setting', createdAt: date, status: 'ACTIVE' },
            { code: 'SETTINGS/UPDATE', name: 'Update setting', description: 'Update setting', createdAt: date, status: 'ACTIVE' },
            { code: 'SETTINGS/DELETE', name: 'Delete setting', description: 'Delete setting', createdAt: date, status: 'ACTIVE' },
            { code: 'DICTIONARIES/GET_ALL', name: 'Get all dictionaries', description: 'Get all dictionaries', createdAt: date, status: 'ACTIVE'},
            { code: 'DICTIONARIES/GET_ID', name: 'Get specified dictionary', description: 'Get specified dictionary', createdAt: date, status: 'ACTIVE' },
            { code: 'DICTIONARIES/CREATE', name: 'Create dictionary', description: 'Create dictionary', createdAt: date, status: 'ACTIVE' },
            { code: 'DICTIONARIES/UPDATE', name: 'Update dictionary', description: 'Update dictionary', createdAt: date, status: 'ACTIVE' },
            { code: 'DICTIONARIES/DELETE', name: 'Delete dictionary', description: 'Delete dictionary', createdAt: date, status: 'ACTIVE' },
            { code: 'CAROUSELS/GET_ALL', name: 'Get all carousels', description: 'Get all carousels', createdAt: date, status: 'ACTIVE'},
            { code: 'CAROUSELS/GET_ID', name: 'Get specified carousel', description: 'Get specified carousel', createdAt: date, status: 'ACTIVE' },
            { code: 'CAROUSELS/CREATE', name: 'Create carousel', description: 'Create carousel', createdAt: date, status: 'ACTIVE' },
            { code: 'CAROUSELS/UPDATE', name: 'Update carousel', description: 'Update carousel', createdAt: date, status: 'ACTIVE' },
            { code: 'CAROUSELS/DELETE', name: 'Delete carousel', description: 'Delete carousel', createdAt: date, status: 'ACTIVE' },
        ];
        MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
            if(err)
                console.log("Error: starting connection before creating Roles collection.");
            let dbo = db.db("cms");
            dbo.dropCollection("roles", function(err, red){});
            Role.insertMany(roles, (err, res) => {});
        })

    }
}