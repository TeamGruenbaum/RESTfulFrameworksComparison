using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Text.RegularExpressions;

namespace libraryapi;

public class IsbnNumberAttribute : ValidationAttribute {
    protected override ValidationResult IsValid(object? value, ValidationContext validationContext) {
        if (value == null) {
            return ValidationResult.Success!;
        }
        
        if (value is not string potentialIsbn) {
            return new ValidationResult("Value must be a string");
        }

        if (Regex.IsMatch(potentialIsbn, @"^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$")) {
            return ValidationResult.Success!;
        }
        
        return new ValidationResult("Value must be in ISBN format");
    }  
} 

