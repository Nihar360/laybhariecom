package com.laybhariecom.demo.dto.request;

import lombok.Data;

@Data
public class AddressRequest {
    private String fullName;
    private String mobile;
    private String email;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private Boolean isDefault = false;
}
