import mongoose, { Schema } from 'mongoose';

const CarouselModel = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date,
        default: new Date
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    itemsDesktop: [{
        item: {
            type: String
        },
        header: {
            type: String
        },
        description: {
            type: String
        },
        button: {
            url: {
                type: String
            },
            text: {
                type: String
            }
        }
    }],
    itemsMobile:[{
        item: {
            type: String
        },
        header: {
            type: String
        },
        description: {
            type: String
        },
        button: {
            url: {
                type: String
            },
            text: {
                type: String
            }
        }
    }],
    configuration: {
        dots: {
            type: Boolean
        },
        arrows: {
            type: Boolean
        },
        autoplay: {
            type: Boolean
        },
        infinite: {
            type: Boolean
        },
        draggable: {
            type: Boolean
        },
        swipe: {
            type: Boolean
        },
        pauseOnHover: {
            type: Boolean
        },
        rtl: {
            type: Boolean
        },
        speed: {
            type: Number
        },
        slidesToShow: {
            type: Number
        }
    }
});

export default mongoose.model('Carousel', CarouselModel);