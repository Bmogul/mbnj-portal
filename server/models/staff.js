const validator = require("validator");
const _ = require('lodash')
const Ajv = require('ajv')
const ajv = new Ajv()
const addFormats = require("ajv-formats")

addFormats(ajv)

ajv.addFormat('phone', /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)

const staffSchema = {
    type: "object",
    properties: {
        its: {
            type: "string",
            minLength: 8,
            maxLength: 8,
        },
        name: {
            type: "string"
        },
        phone: {
            type: "string",
            format: "phone"
        },
        role: {
            type: "array",
            items: {
                type: "string",
                enum: ["teacher", "masuleen","headMoallim", "admin"]
            }
        },
        password: {
            type: "string"
        },
        tokens: {
            type: "array"
        },
        attendanceClass: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                teachers: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            },
                            phone: {
                                type: "string",
                                format: "phone"
                            }
                        },
                        required: ["name", "phone"]
                    }
                }
            },
            required: ["id", "name", "teachers"]
        },
        classes: {
            type: "object",
            properties: {
                Period1: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        teachers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string"
                                    },
                                    phone: {
                                        type: "string",
                                        format: "phone"
                                    }
                                },
                                required: ["name", "phone"]
                            }
                        }
                    },
                    required: ["id", "name", "teachers"]
                },
                Period2: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        teachers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string"
                                    },
                                    phone: {
                                        type: "string",
                                        format: "phone"
                                    }
                                },
                                required: ["name", "phone"]
                            }
                        }
                    },
                    required: ["id", "name", "teachers"]
                },
                Period3: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        teachers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string"
                                    },
                                    phone: {
                                        type: "string",
                                        format: "phone"
                                    }
                                },
                                required: ["name", "phone"]
                            }
                        }
                    },
                    required: ["id", "name", "teachers"]
                },
                Period4: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        teachers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string"
                                    },
                                    phone: {
                                        type: "string",
                                        format: "phone"
                                    }
                                },
                                required: ["name", "phone"]
                            }
                        }
                    },
                    required: ["id", "name", "teachers"]
                },
                Period5: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        teachers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string"
                                    },
                                    phone: {
                                        type: "string",
                                        format: "phone"
                                    }
                                },
                                required: ["name", "phone"]
                            }
                        }
                    },
                    required: ["id", "name", "teachers"]
                },
                Period6: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        teachers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string"
                                    },
                                    phone: {
                                        type: "string",
                                        format: "phone"
                                    }
                                },
                                required: ["name", "phone"]
                            }
                        }
                    },
                    required: ["id", "name", "teachers"]
                },
                Period7: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        teachers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string"
                                    },
                                    phone: {
                                        type: "string",
                                        format: "phone"
                                    }
                                },
                                required: ["name", "phone"]
                            }
                        }
                    },
                    required: ["id", "name", "teachers"]
                }
            }
        }

    },
    required: ["its", "name", "phone", "role", "password", "classes"],
    additionalProperties: false
}

const validate = ajv.compile(staffSchema)

const Staff = (props, callback) => {
    const valid = validate(props)
    if(valid) {
        callback(null)
    } else {
        callback(validate.errors[0].message)
    }
}

module.exports = Staff;