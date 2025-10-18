# Quick Fix Guide - orElseThrow & ResourceNotFoundException Errors

## Problem
Getting compilation errors on:
- `orElseThrow` method calls
- `ResourceNotFoundException` not found

## Solution

### Step 1: Create the Exception Classes

Create these files in `src/main/java/com/spicehouse/exception/`:

#### ResourceNotFoundException.java
```java
package com.spicehouse.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

#### BadRequestException.java
```java
package com.spicehouse.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
    
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

### Step 2: Fix orElseThrow Syntax

**❌ WRONG (doesn't work in older Java versions):**
```java
User user = userRepository.findById(id).orElseThrow();
```

**✅ CORRECT (works in all Java versions):**
```java
User user = userRepository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
```

### Step 3: Common Patterns to Use

#### In UserService.java:
```java
// Get user by ID
public User getUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
}

// Get user by email
public User getUserByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
}
```

#### In ProductService.java:
```java
public ProductResponse getProductById(Long id) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    return convertToResponse(product);
}
```

#### In CartService.java:
```java
public CartItemResponse addToCart(User user, CartItemRequest request) {
    Product product = productRepository.findById(request.getProductId())
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    
    // ... rest of the code
}

public void removeFromCart(User user, Long cartItemId) {
    CartItem cartItem = cartItemRepository.findById(cartItemId)
        .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
    
    // ... rest of the code
}
```

#### In OrderService.java:
```java
public OrderResponse getOrderById(User user, Long orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    
    // ... rest of the code
}

public OrderResponse getOrderByNumber(User user, String orderNumber) {
    Order order = orderRepository.findByOrderNumber(orderNumber)
        .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    
    // ... rest of the code
}
```

#### In CategoryService.java:
```java
public Category getCategoryByName(String name) {
    return categoryRepository.findByName(name)
        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + name));
}
```

### Step 4: Verify Imports

Make sure every service file has these imports:

```java
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.exception.BadRequestException;
```

### Step 5: Check Java Version

In your `pom.xml`, make sure you have Java 17 specified:

```xml
<properties>
    <java.version>17</java.version>
</properties>
```

### Step 6: Rebuild the Project

After making these changes:

```bash
mvn clean install
```

## Complete Example: UserService.java (Fixed)

```java
package com.spicehouse.service;

import com.spicehouse.dto.request.RegisterRequest;
import com.spicehouse.entity.User;
import com.spicehouse.exception.BadRequestException;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
    
    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        if (request.getMobile() != null && userRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number already exists");
        }
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);
        
        return userRepository.save(user);
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
```

## Summary

**The key fix is simple:**

Always use this pattern:
```java
.orElseThrow(() -> new ResourceNotFoundException("Your message here"))
```

Instead of:
```java
.orElseThrow()  // ❌ Doesn't work in all Java versions
```

This will fix all your compilation errors!
