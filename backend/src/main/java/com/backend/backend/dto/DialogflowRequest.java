package com.backend.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DialogflowRequest {

    private String session;
    private QueryResult queryResult;

    @Data
    public static class QueryResult {
        private String queryText;
        private String action;
        private Map<String, Object> parameters;
        private Intent intent;
    }

    @Data
    public static class Intent {
        private String name;
        private String displayName;
    }
}
