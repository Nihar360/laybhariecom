# All Corrected Service Classes - Spring Boot Backend

## 1. JwtService.java

```java
package com.spicehouse.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
```

---

## 2. UserService.java

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

---

## 3. ProductService.java

```java
package com.spicehouse.service;

import com.spicehouse.dto.response.ProductResponse;
import com.spicehouse.entity.Product;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return convertToResponse(product);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(String categoryName) {
        return productRepository.findByCategoryName(categoryName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findFeaturedProducts().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getAvailableProducts() {
        return productRepository.findByInStockTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setOriginalPrice(product.getOriginalPrice());
        response.setImage(product.getImage());
        response.setImages(product.getImages());
        response.setRating(product.getRating());
        response.setReviews(product.getReviews());
        response.setBadge(product.getBadge());
        response.setCategory(product.getCategory().getName());
        response.setDescription(product.getDescription());
        response.setFeatures(product.getFeatures());
        response.setSizes(product.getSizes());
        response.setInStock(product.getInStock());
        response.setStockCount(product.getStockCount());
        return response;
    }
}
```

---

## 4. CategoryService.java

```java
package com.spicehouse.service;

import com.spicehouse.entity.Category;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + name));
    }
}
```

---

## 5. CartService.java

```java
package com.spicehouse.service;

import com.spicehouse.dto.request.CartItemRequest;
import com.spicehouse.dto.response.CartItemResponse;
import com.spicehouse.entity.CartItem;
import com.spicehouse.entity.Product;
import com.spicehouse.entity.User;
import com.spicehouse.exception.BadRequestException;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.CartItemRepository;
import com.spicehouse.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public CartItemResponse addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (!product.getInStock()) {
            throw new BadRequestException("Product is out of stock");
        }
        
        if (product.getStockCount() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProductAndSizeAndColor(
                user, product, request.getSize(), request.getColor()
        );
        
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            return convertToResponse(cartItemRepository.save(existingItem));
        }
        
        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setSize(request.getSize());
        cartItem.setColor(request.getColor());
        
        return convertToResponse(cartItemRepository.save(cartItem));
    }
    
    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CartItemResponse updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }
        
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }
        
        if (cartItem.getProduct().getStockCount() < quantity) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        cartItem.setQuantity(quantity);
        return convertToResponse(cartItemRepository.save(cartItem));
    }
    
    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
    
    private CartItemResponse convertToResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();
        response.setId(cartItem.getId());
        response.setProductId(cartItem.getProduct().getId());
        response.setProductName(cartItem.getProduct().getName());
        response.setPrice(cartItem.getProduct().getPrice());
        response.setImage(cartItem.getProduct().getImage());
        response.setQuantity(cartItem.getQuantity());
        response.setSize(cartItem.getSize());
        response.setColor(cartItem.getColor());
        response.setSubtotal(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        return response;
    }
}
```

---

## 6. OrderService.java

```java
package com.spicehouse.service;

import com.spicehouse.dto.request.AddressRequest;
import com.spicehouse.dto.request.OrderRequest;
import com.spicehouse.dto.response.*;
import com.spicehouse.entity.*;
import com.spicehouse.exception.BadRequestException;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public OrderResponse createOrder(User user, OrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }
        
        Order order = new Order();
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUser(user);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCouponCode(request.getCouponCode());
        order.setNotes(request.getNotes());
        
        Address shippingAddress = convertToAddress(request.getShippingAddress());
        shippingAddress.setUser(user);
        order.setShippingAddress(shippingAddress);
        
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            if (!product.getInStock() || product.getStockCount() < cartItem.getQuantity()) {
                throw new BadRequestException("Product " + product.getName() + " is out of stock");
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItem.setColor(cartItem.getColor());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            
            orderItems.add(orderItem);
            subtotal = subtotal.add(orderItem.getSubtotal());
            
            product.setStockCount(product.getStockCount() - cartItem.getQuantity());
            productRepository.save(product);
        }
        
        order.setOrderItems(orderItems);
        order.setSubtotal(subtotal);
        
        BigDecimal discount = request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO;
        order.setDiscount(discount);
        
        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(25)) >= 0 ? 
                BigDecimal.ZERO : BigDecimal.valueOf(5.99);
        order.setShipping(shipping);
        
        BigDecimal total = subtotal.subtract(discount).add(shipping);
        order.setTotal(total);
        
        Order savedOrder = orderRepository.save(order);
        
        cartItemRepository.deleteByUser(user);
        
        return convertToResponse(savedOrder);
    }
    
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to order");
        }
        
        return convertToResponse(order);
    }
    
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(User user, String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to order");
        }
        
        return convertToResponse(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setSubtotal(order.getSubtotal());
        response.setDiscount(order.getDiscount());
        response.setShipping(order.getShipping());
        response.setTotal(order.getTotal());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setStatus(order.getStatus());
        response.setOrderDate(order.getOrderDate());
        response.setDeliveredDate(order.getDeliveredDate());
        
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::convertToOrderItemResponse)
                .collect(Collectors.toList());
        response.setItems(itemResponses);
        
        response.setShippingAddress(convertToAddressResponse(order.getShippingAddress()));
        
        return response;
    }
    
    private OrderItemResponse convertToOrderItemResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(orderItem.getId());
        response.setProductId(orderItem.getProduct().getId());
        response.setProductName(orderItem.getProduct().getName());
        response.setProductImage(orderItem.getProduct().getImage());
        response.setQuantity(orderItem.getQuantity());
        response.setSize(orderItem.getSize());
        response.setColor(orderItem.getColor());
        response.setPrice(orderItem.getPrice());
        response.setSubtotal(orderItem.getSubtotal());
        return response;
    }
    
    private Address convertToAddress(AddressRequest request) {
        Address address = new Address();
        address.setFullName(request.getFullName());
        address.setMobile(request.getMobile());
        address.setEmail(request.getEmail());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZipCode(request.getZipCode());
        address.setCountry(request.getCountry());
        address.setIsDefault(request.getIsDefault());
        return address;
    }
    
    private AddressResponse convertToAddressResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setFullName(address.getFullName());
        response.setMobile(address.getMobile());
        response.setEmail(address.getEmail());
        response.setAddressLine1(address.getAddressLine1());
        response.setAddressLine2(address.getAddressLine2());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setZipCode(address.getZipCode());
        response.setCountry(address.getCountry());
        response.setIsDefault(address.getIsDefault());
        return response;
    }
}
```

---

## Key Changes Made:

### ✅ All `.orElseThrow()` calls now use lambda syntax:

**Before (Wrong):**
```java
.orElseThrow()
```

**After (Correct):**
```java
.orElseThrow(() -> new ResourceNotFoundException("Message"))
```

### ✅ Changed in CartService:
```java
// Changed from:
CartItem existingItem = cartItemRepository.findByUserAndProductAndSizeAndColor(...).orElse(null);

// To:
Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProductAndSizeAndColor(...);
if (existingItemOpt.isPresent()) {
    CartItem existingItem = existingItemOpt.get();
    // ...
}
```

### ✅ All imports included:
```java
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.exception.BadRequestException;
```

## Copy these files to your project and rebuild:

```bash
mvn clean install
```

All compilation errors should be resolved! 🚀
