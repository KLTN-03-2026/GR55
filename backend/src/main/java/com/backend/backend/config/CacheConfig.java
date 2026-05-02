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
                entry("sach_mien_phi",      macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("sach_hoi_vien",      macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("sach_goi_y",         macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("chi_tiet_sach",      macDinh.entryTtl(Duration.ofMinutes(10))),
                entry("sach_lien_quan",     macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("danh_gia_sach",      macDinh.entryTtl(Duration.ofMinutes(10))),
                entry("tim_kiem_sach",        macDinh.entryTtl(Duration.ofMinutes(5))),
                entry("goi_y_tim_kiem",       macDinh.entryTtl(Duration.ofHours(1))),
                entry("sach_theo_the_loai",   macDinh.entryTtl(Duration.ofMinutes(10))),
                entry("goi_y_sach_khach",        macDinh.entryTtl(Duration.ofHours(1))),
                entry("goi_y_sach_thanh_vien",   macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("faq_chatbot",             macDinh.entryTtl(Duration.ofHours(24))),
                entry("lich_su_don_hang",        macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("chi_tiet_don_hang",       macDinh.entryTtl(Duration.ofHours(1))),
                entry("danh_gia_admin",          macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("don_hang_admin",          macDinh.entryTtl(Duration.ofMinutes(15))),
                entry("chi_tiet_don_hang_admin", macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("chuong_trinh_giam_gia",   macDinh.entryTtl(Duration.ofHours(1))),
                entry("gia_sach_da_giam",        macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("giam_gia_home",           macDinh.entryTtl(Duration.ofMinutes(5))),
                entry("giam_gia_info_sach",      macDinh.entryTtl(Duration.ofMinutes(10))),
                entry("thong_ke_tong_quan",      macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("thong_ke_doanh_thu",      macDinh.entryTtl(Duration.ofHours(1))),
                entry("sach_ban_chay",           macDinh.entryTtl(Duration.ofHours(1))),
                entry("nguoi_dung_moi",          macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("thong_ke_sach_the_loai",  macDinh.entryTtl(Duration.ofHours(1))),
                entry("goi_hoi_vien",            macDinh.entryTtl(Duration.ofHours(1))),
                entry("thong_tin_hoi_vien",      macDinh.entryTtl(Duration.ofMinutes(30))),
                entry("goi_hoi_vien_admin",      macDinh.entryTtl(Duration.ofHours(1)))
        );

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(macDinh)
                .withInitialCacheConfigurations(cauHinhRieng)
                .build();
    }
}
