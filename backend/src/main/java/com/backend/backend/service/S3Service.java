package com.backend.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String tenBucket;

    public String uploadFile(MultipartFile file, String thuMuc) throws IOException {
        String tenFile = thuMuc + UUID.randomUUID() + "_" + file.getOriginalFilename();

        ObjectMetadata metaData = new ObjectMetadata();
        metaData.setContentLength(file.getSize());
        metaData.setContentType(file.getContentType());

        amazonS3.putObject(
                new PutObjectRequest(tenBucket, tenFile, file.getInputStream(), metaData)
        );

        return amazonS3.getUrl(tenBucket, tenFile).toString();
    }

    public void xoaFile(String urlFile) {
        if (urlFile == null || urlFile.isBlank()) return;
        try {
            int viTriBucketName = urlFile.indexOf(tenBucket);
            if (viTriBucketName == -1) return;
            String khoaFile = urlFile.substring(viTriBucketName + tenBucket.length() + 1);
            amazonS3.deleteObject(tenBucket, khoaFile);
        } catch (Exception e) {
            log.warn("Không thể xóa file S3: {}", urlFile);
        }
    }
}
