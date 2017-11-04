exports.format = (message, status = 500, code) => {
  const messageFormat = {
    errorContent: {
      error: true,
      message,
    },
    errorStatus: status,
  };

  if (code) {
    messageFormat.errorContent.code = code;
  }

  return messageFormat;
};

exports.catchError = (res, err) => {
  console.log('CATCHED ERROR:', err);
  if (err.errorStatus && err.errorContent) {
    const errorStatus = err.errorStatus;
    const errorContent = err.errorContent;
    res.status(errorStatus).json(errorContent);
    return;
  }
  res.status(500).json({ error: true, message: err.toString() });
};

exports.verifyRequiredAndThrowException = values => {
  const textError = 'Los siguientes campos requeridos faltan:';
  const valueError = [];

  for (const value in values) {
    console.log(`Will check for ${value}: ${values[value]}`);
    if (!values[value]
      || values[value] === undefined
      || values[value] === null
      || values[value] === 'null') {
      valueError.push(value);
    }
  }

  if (valueError.length > 0) {
    throw this.format(`${textError} ${valueError.toString()}`, 400);
  }

};

