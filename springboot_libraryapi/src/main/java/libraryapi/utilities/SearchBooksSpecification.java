package libraryapi.utilities;

import libraryapi.models.Book;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SearchBooksSpecification implements Specification<Book> {
    private final String[] fieldNames;
    private final String searchValue;

    public SearchBooksSpecification(String[] fieldNames, String searchValue) {
        this.fieldNames=fieldNames;
        this.searchValue=searchValue;
    }

    @Override
    public Predicate toPredicate(Root<Book> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates=new ArrayList<>();
        for(String fieldName : fieldNames) {
            predicates.add(criteriaBuilder.like(root.<String>get(fieldName), "%" + searchValue + "%"));
        }
        return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
    }
}
