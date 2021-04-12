import Faq from '../models/faqModel';
import Menu from '../models/menuModel';
import Page from '../models/pageModel';
import Image from '../models/imageModel';
import Settings from '../models/settingsModel';
import Dictionary from '../models/dictionaryModel';
import Carousel from '../models/carouselModel';

module.exports = {
    validateEmail: function(email) {
        let emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegExp.test(String(email).toLowerCase());
    },
    validateFields: function(object, data) {
        let result = {
            message: '',
            status: true
        };
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                if (object[key].required && (data[key] === '' || data[key] === null || data[key] === undefined)) {
                    result.message += 'Field ' + key + ' is required. ';
                    result.status = false;
                }
            }
        }
        return result;
    },
    validateMenuElements: function(elements) {
        if (elements) {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].hasOwnProperty('url') && elements[i].hasOwnProperty('text')) {
                    if (!elements[i].url || !elements[i].text) {
                        return false;
                    } else if (elements[i].hasOwnProperty('children') && elements[i].children.length) {
                        return module.exports.validateMenuElements(elements[i].children);
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    },
    validateNameAndCode: function(name, code, messages) {
        if (code.length < 5)
            return messages.codeLength;
        if (!(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð_,.'-]+$/u.test(code)))
            return messages.codeRegexp;
        if (name.length < 5)
            return messages.nameLength;
        if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(name)))
            return messages.nameRegexp;
        return '';
    },
    validatePageFields: function(metaTags, styles, contents, messages) {
        if (metaTags) {
            for (let i = 0; i < metaTags.length; i++) {
                if (metaTags[i].hasOwnProperty('name') && metaTags[i].hasOwnProperty('content')) {
                    if (!metaTags[i].name || !metaTags[i].content)
                        return messages.incorrectMetaTags;
                }
            }
        }
        if (styles) {
            for (let i = 0; i < styles.length; i++) {
                if (styles[i].hasOwnProperty('property') && styles[i].hasOwnProperty('value')) {
                    if (!styles[i].property || !styles[i].value)
                        return messages.incorrectStyles;
                }
            }
        }
        if (contents) {
            for (let i = 0; i < contents.length; i++) {
                if (contents[i].hasOwnProperty('content') && contents[i].hasOwnProperty('selector')) {
                    if (!contents[i].content || !contents[i].selector)
                        return messages.incorrectContents;
                }
            }
        }
        return '';
    },
    checkFaqCode: async function(code) {
        try {
            return Faq.findOne({ code: code })
        } catch(error) {
            throw new Error(error)
        }
    },
    checkMenuCode: async function(code) {
        try {
            return Menu.findOne({ code: code })
        } catch(error) {
            throw new Error(error)
        }
    },
    checkPageCode: async function(code) {
        try {
            return Page.findOne({ code: code })
        } catch(error) {
            throw new Error(error)
        }
    },
    checkImageCode: async function(code) {
        try {
            return Image.findOne({ code: code })
        } catch(error) {
            throw new Error(error)
        }
    },
    checkSettingsCode: async function(code) {
        try {
            return Settings.findOne({ code: code })
        } catch(error) {
            throw new Error(error)
        }
    },
    checkDictionaryCode: async function(code) {
        try {
            return Dictionary.findOne({ code: code })
        } catch(error) {
            throw new Error(error)
        }
    },
    checkCarouselCode: async function(code) {
        try {
            return Carousel.findOne({ code: code })
        } catch(error) {
            throw new Error(error)
        }
    }
}