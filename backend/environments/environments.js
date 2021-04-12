module.exports = {
    messages: {
        global: {
            errors: {
                permission: "You don't have permission to perform this action",
                userInactive: "You don't have permission to perform this action, because your account is INACTIVE",
                userDeleted: "You don't have permission to perform this action, because your account was DELETED",
                roleInactive: "This function is disabled. If you have proper role you can activate it in roles module.",
                incorrectArrayElements: "Array of elements is incorrect"
            }
        },
        users: {
            errors: {
                email: "Please provide correct email address",
                firstName: "Please provide correct first name: it must contain only letters without spaces",
                lastName: "Please provide correct last name: it must contain only letters without spaces",
                password: "Please provide correct password: it must have at least 6 characters",
                emailExists: "User with specified email already exists",
                idNotFound: "User with specified id not found",
                emailNotFound: "User with specified email not found",
                wrongPassword: "Wrong password",
                inactive: "Can't login to inactive user",
                deleted: "Can't login to deleted user"
            },
            success: {
                created: "User successfully created",
                fetched: "User successfully fetched",
                updated: "User successfully updated",
                removed: "User successfully removed",
                loggedIn: "Successfully logged in",
                activated: "User successfully activated",
                deactivated: "User successfully deactivated"
            }
        },
        roles: {
            errors: {
                codeExists: "Role with specified code already exists",
                idNotFound: "Role with specified id not found",
            },
            success: {
                created: "Role successfully created",
                rolesFetched: "Roles successfully fetched",
                roleFetched: "Role successfully fetched",
                updated: "Role successfully updated",
                removed: "Role successfully removed",
                activated: "Role successfully activated",
                deactivated: "Role successfully deactivated"
            }
        },
        faqs: {
            errors: {
                codeLength: "Field Code must have at least 5 characters",
                codeRegexp: "Field Code contains wrong characters",
                nameLength: "Field Name must have at least 5 characters",
                nameRegexp: "Field Name contains wrong characters",
                idNotFound: "Faq with specified id not found",
                codeExists: "Faq with specified code already exists"
            },
            success: {
                created: "Faq successfully created",
                fetched: "Faq successfully fetched",
                updated: "Faq successfully updated",
                removed: "Faq successfully removed",
                activated: "Faq successfully activated",
                deactivated: "Faq successfully deactivated"
            }
        },
        menus: {
            errors: {
                codeLength: "Field Code must have at least 5 characters",
                codeRegexp: "Field Code contains wrong characters",
                nameLength: "Field Name must have at least 5 characters",
                nameRegexp: "Field Name contains wrong characters",
                idNotFound: "Menu with specified id not found",
                codeExists: "Menu with specified code already exists"
            },
            success: {
                created: "Menu successfully created",
                fetched: "Menu successfully fetched",
                updated: "Menu successfully updated",
                removed: "Menu successfully removed",
                activated: "Menu successfully activated",
                deactivated: "Menu successfully deactivated"
            }
        },
        pages: {
            errors: {
                codeLength: "Field Code must have at least 5 characters",
                codeRegexp: "Field Code contains wrong characters",
                nameLength: "Field Name must have at least 5 characters",
                nameRegexp: "Field Name contains wrong characters",
                idNotFound: "Page with specified id not found",
                codeExists: "Page with specified code already exists",
                incorrectMetaTags: "Meta Tags have incorrect values",
                incorrectStyles: "Styles have incorrect values",
                incorrectContents: "Contents have incorrect values"
            },
            success: {
                created: "Page successfully created",
                fetched: "Page successfully fetched",
                updated: "Page successfully updated",
                removed: "Page successfully removed",
                activated: "Page successfully activated",
                deactivated: "Page successfully deactivated"
            }
        },
        images: {
            errors: {
                codeLength: "Field Code must have at least 5 characters",
                codeRegexp: "Field Code contains wrong characters",
                nameLength: "Field Name must have at least 5 characters",
                nameRegexp: "Field Name contains wrong characters",
                idNotFound: "Image with specified id not found",
                codeExists: "Image with specified code already exists"
            },
            success: {
                created: "Image successfully created",
                fetched: "Image successfully fetched",
                updated: "Image successfully updated",
                removed: "Image successfully removed",
                activated: "Image successfully activated",
                deactivated: "Image successfully deactivated"
            }
        },
        settings: {
            errors: {
                codeLength: "Field Code must have at least 5 characters",
                codeRegexp: "Field Code contains wrong characters",
                nameLength: "Field Name must have at least 5 characters",
                nameRegexp: "Field Name contains wrong characters",
                idNotFound: "Setting with specified id not found",
                codeExists: "Setting with specified code already exists",
                invalidType: "Field Type have invalid value",
                invalidBooleanValue: "Invalid value for boolean type",
                invalidNumberValue: "Invalid value for number type"
            },
            success: {
                created: "Setting successfully created",
                fetched: "Setting successfully fetched",
                updated: "Setting successfully updated",
                removed: "Setting successfully removed",
                activated: "Setting successfully activated",
                deactivated: "Setting successfully deactivated"
            }
        },
        dictionaries: {
            errors: {
                codeLength: "Field Code must have at least 5 characters",
                codeRegexp: "Field Code contains wrong characters",
                nameLength: "Field Name must have at least 5 characters",
                nameRegexp: "Field Name contains wrong characters",
                idNotFound: "Setting with specified id not found",
                codeExists: "Setting with specified code already exists",
                invalidType: "Field Type have invalid value",
                invalidBooleanValue: "Invalid value for boolean type",
                invalidNumberValue: "Invalid value for number type",
                languageLength: "Field Language must have maximum 3 characters",
                elementsLength: "All elements must contain text"
            },
            success: {
                created: "Dictionary successfully created",
                fetched: "Dictionary successfully fetched",
                updated: "Dictionary successfully updated",
                removed: "Dictionary successfully removed",
                activated: "Dictionary successfully activated",
                deactivated: "Dictionary successfully deactivated"
            }
        },
        carousels: {
            errors: {
                codeLength: "Field Code must have at least 5 characters",
                codeRegexp: "Field Code contains wrong characters",
                nameLength: "Field Name must have at least 5 characters",
                nameRegexp: "Field Name contains wrong characters",
                idNotFound: "Carousel with specified id not found",
                codeExists: "Carousel with specified code already exists"
            },
            success: {
                created: "Carousel successfully created",
                fetched: "Carousel successfully fetched",
                updated: "Carousel successfully updated",
                removed: "Carousel successfully removed",
                activated: "Carousel successfully activated",
                deactivated: "Carousel successfully deactivated"
            }
        }
    },
    roles: {
        users: {
            getAll: "USERS/GET_ALL",
            getId: "USERS/GET_ID",
            create: "USERS/CREATE",
            update: "USERS/UPDATE",
            delete: "USERS/DELETE"
        },
        roles: {
            getAll: "ROLES/GET_ALL",
            getId: "ROLES/GET_ID",
            create: "ROLES/CREATE",
            update: "ROLES/UPDATE",
            delete: "ROLES/DELETE"
        },
        faqs: {
            getAll: "FAQS/GET_ALL",
            getId: "FAQS/GET_ID",
            create: "FAQS/CREATE",
            update: "FAQS/UPDATE",
            delete: "FAQS/DELETE"
        },
        menus: {
            getAll: "MENUS/GET_ALL",
            getId: "MENUS/GET_ID",
            create: "MENUS/CREATE",
            update: "MENUS/UPDATE",
            delete: "MENUS/DELETE"
        },
        pages: {
            getAll: "PAGES/GET_ALL",
            getId: "PAGES/GET_ID",
            create: "PAGES/CREATE",
            update: "PAGES/UPDATE",
            delete: "PAGES/DELETE"
        },
        images: {
            getAll: "IMAGES/GET_ALL",
            getId: "IMAGES/GET_ID",
            create: "IMAGES/CREATE",
            update: "IMAGES/UPDATE",
            delete: "IMAGES/DELETE"
        },
        settings: {
            getAll: "SETTINGS/GET_ALL",
            getId: "SETTINGS/GET_ID",
            create: "SETTINGS/CREATE",
            update: "SETTINGS/UPDATE",
            delete: "SETTINGS/DELETE"
        },
        dictionaries: {
            getAll: "DICTIONARIES/GET_ALL",
            getId: "DICTIONARIES/GET_ID",
            create: "DICTIONARIES/CREATE",
            update: "DICTIONARIES/UPDATE",
            delete: "DICTIONARIES/DELETE"
        },
        carousels: {
            getAll: "CAROUSELS/GET_ALL",
            getId: "CAROUSELS/GET_ID",
            create: "CAROUSELS/CREATE",
            update: "CAROUSELS/UPDATE",
            delete: "CAROUSELS/DELETE"
        },
    }
}