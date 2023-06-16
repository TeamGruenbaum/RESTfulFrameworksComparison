package libraryapi.models.dataTransferObjects;

import java.util.List;

public record ErrorsResponse(List<String> messages) {}
