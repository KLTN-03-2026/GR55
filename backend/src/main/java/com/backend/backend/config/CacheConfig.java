package com.backend.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.Map;
import static java.util.Map.entry;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.activateDefaultTyping(
                BasicPolymorphicTypeValidator.builder().allowIfBaseType(Object.class).build(),
                ObjectMapper.DefaultTyping.NON_FINAL
        );

        RedisCacheConfiguration macDinh = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper)))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> cauHinhRieng = Map.ofEntries(
                entry("danh_muc",           macDinh.entryTtl(Duration.ofHours(1))),
                entry("nguoi_dung",         macDinh.entryTtl(Duration.ofHours(1))),
                entry("sach",               macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("danh_muc_trang_chu", macDinh.entryTtl(Duration.ofHours(1))),
                entry("sach_noi_bat",       macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("sach_moi_nhat",      macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("sach_mien_phi",      macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("sach_hoi_vien",      macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("sach_goi_y",         macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("chi_tiet_sach",      macDinh.entryTtl(Duration.ofMinutes(10))),
                entry("sach_lien_quan",     macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("danh_gia_sach",      macDinh.entryTtl(Duration.ofMinutes(10))),
                entry("tim_kiem_sach",        macDinh.entryTtl(Duration.ofMinutes(5))),
                entry("goi_y_tim_kiem",       macDinh.entryTtl(Duration.ofHours(1)))
        );

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(macDinh)
                .withInitialCacheConfigurations(cauHinhRieng)
                .build();
    }
}
