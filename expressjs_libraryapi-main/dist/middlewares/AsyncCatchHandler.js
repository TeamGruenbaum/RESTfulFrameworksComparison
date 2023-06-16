export const asyncCatchHandler = (handler) => {
    const handlerFunction = handler;
    return (request, response, next) => {
        return handlerFunction(request, response, next)?.catch(next);
    };
};
