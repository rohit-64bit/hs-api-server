const errorLooger = (error, req, res) => {

    console.error(error);
    
    res.status(500).json({
        success: false,
        message: error.message
    });

}

module.exports = errorLooger;