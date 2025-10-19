package com.laybhariecom.demo.dto.response;

import lombok.Data;

@Data
public class AddressResponse {
    private Long id;
    private String fullName;
    private String mobile;
    private String email;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private Boolean isDefault;
}
