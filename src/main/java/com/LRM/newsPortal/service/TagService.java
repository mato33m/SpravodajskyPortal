package com.LRM.newsPortal.service;

import com.LRM.newsPortal.dto.TagDTO;
import com.LRM.newsPortal.model.Tag;
import com.LRM.newsPortal.repository.TagRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    private static final Logger log = LoggerFactory.getLogger(TagService.class);

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public TagDTO getTagById(String tagName) {
        Tag tag = tagRepository.findById(tagName)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        TagDTO tagDTO = new TagDTO(tag.getTagName());

        return tagDTO;
    }

    public List<TagDTO> getAllTags() {
        List<Tag> tags = tagRepository.findAll();

        List<TagDTO> tagsDTO = new java.util.LinkedList<>();

        for (int i = 0; i < tags.size(); i++){
            tagsDTO.add(new TagDTO(tags.get(i).getTagName()));
        }

        return tagsDTO;
    }

    public void updateTag(String tagName, TagDTO tagDTO) {
        Tag tag = tagRepository.findById(tagName)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        Tag updated = new Tag(tagDTO.tagName());
        tagRepository.deleteById(tagName);
        tagRepository.save(updated);

        log.info("Updating tag {}", tagDTO);
    }

    public void createTag(TagDTO tagDTO){
        Tag tag = new Tag(tagDTO.tagName());

        tagRepository.save(tag);

        log.info("Creating tag {}", tagDTO);
    }

    public void deleteTag(String tagName){
        tagRepository.deleteById(tagName);

        log.info("Deleting tag {}", tagName);
    }
}