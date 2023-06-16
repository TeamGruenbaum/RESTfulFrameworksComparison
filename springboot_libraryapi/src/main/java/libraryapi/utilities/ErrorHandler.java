package libraryapi.utilities;

import libraryapi.models.dataTransferObjects.ErrorResponse;
import libraryapi.models.dataTransferObjects.ErrorsResponse;
import libraryapi.models.errors.NotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class ErrorHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> notFoundHandler(NotFoundException exception) {
        return new ResponseEntity<>(new ErrorResponse(exception.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<?> badRequestHandler(ConstraintViolationException exception) {
        List<String> errorMessages=new ArrayList<String>();
        for(ConstraintViolation<?> constraintViolation: exception.getConstraintViolations()) {
            errorMessages.add(constraintViolation.getMessage());
        }
        return new ResponseEntity<>(new ErrorsResponse(errorMessages), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<?> badRequestHandler(MethodArgumentNotValidException exception) {
        List<String> errorMessages=new ArrayList<String>();
        for(FieldError fieldError:exception.getBindingResult().getFieldErrors()) {
            errorMessages.add(fieldError.getDefaultMessage());
        }
        return new ResponseEntity<>(new ErrorsResponse(errorMessages), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> methodNotSupportedExceptionHandler(HttpRequestMethodNotSupportedException exception) {
        return new ResponseEntity<>(new ErrorResponse(exception.getMessage()), HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> otherExceptionHandler(Exception exception) {
        return new ResponseEntity<>(new ErrorResponse(exception.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
