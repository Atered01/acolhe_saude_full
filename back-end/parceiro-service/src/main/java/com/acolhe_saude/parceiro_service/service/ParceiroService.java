package com.acolhe_saude.parceiro_service.service;

import com.acolhe_saude.parceiro_service.domain.CapacidadeAtendimento;
import com.acolhe_saude.parceiro_service.domain.Parceiro;
import com.acolhe_saude.parceiro_service.dto.AtualizarRecursosDTO;
import com.acolhe_saude.parceiro_service.dto.ParceiroListagemDTO;
import com.acolhe_saude.parceiro_service.dto.ParceiroRequestDTO;
import com.acolhe_saude.parceiro_service.dto.ParceiroResponseDTO;
import com.acolhe_saude.parceiro_service.repository.CapacidadeAtendimentoRepository;
import com.acolhe_saude.parceiro_service.repository.ParceiroRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ParceiroService {

    private final ParceiroRepository parceiroRepository;
    private final CapacidadeAtendimentoRepository capacidadeRepository;

    public ParceiroService(ParceiroRepository parceiroRepository, CapacidadeAtendimentoRepository capacidadeRepository) {
        this.parceiroRepository = parceiroRepository;
        this.capacidadeRepository = capacidadeRepository;
    }

    @Transactional
    public ParceiroResponseDTO cadastrarNovoParceiro(ParceiroRequestDTO dto) {

        Parceiro parceiro = new Parceiro();
        parceiro.setIdUsuarioAuth(dto.idUsuarioAuth());
        parceiro.setNomeApresentacao(dto.nomeApresentacao());
        parceiro.setTipoParceiro(dto.tipoParceiro());
        parceiro.setDocumento(dto.documento());
        parceiro.setRegistroConselho(dto.registroConselho());
        parceiro.setEnderecoAtendimento(dto.enderecoAtendimento());

        Parceiro parceiroSalvo = parceiroRepository.save(parceiro);

        if (dto.capacidades() != null && !dto.capacidades().isEmpty()) {
            dto.capacidades().forEach(cap -> {
                CapacidadeAtendimento capacidade = new CapacidadeAtendimento();
                capacidade.setParceiro(parceiroSalvo);
                capacidade.setEspecialidade(cap.especialidade());
                capacidade.setVagasDisponiveisSemana(cap.vagasDisponiveisSemana());

                capacidadeRepository.save(capacidade);
            });
        }

        return new ParceiroResponseDTO(
                parceiroSalvo.getIdParceiro(),
                parceiroSalvo.getNomeApresentacao(),
                "Cadastro realizado com sucesso!"
        );
    }

    public List<ParceiroListagemDTO> listarTodos() {
        return parceiroRepository.findAll().stream()
                .map(ParceiroListagemDTO::new)
                .toList();
    }

    public List<ParceiroListagemDTO> listarDisponiveisParaEncaminhamento() {
        // Retorna apenas parceiros que aceitam emergências E que tenham pelo menos 1 leito (UTI ou Enfermaria)
        return parceiroRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getAceitandoEmergencias()))
                .filter(p -> (p.getLeitosEnfermaria() != null && p.getLeitosEnfermaria() > 0) ||
                        (p.getLeitosUti() != null && p.getLeitosUti() > 0))
                .map(ParceiroListagemDTO::new)
                .toList();
    }

    @Transactional
    public void suspenderParceiro(int idParceiro) {
        parceiroRepository.deleteById(idParceiro);
    }

    @Transactional
    public void atualizarRecursos(int idUsuarioAuth, AtualizarRecursosDTO dto) {

        Parceiro parceiro = parceiroRepository.findByIdUsuarioAuth(idUsuarioAuth)
                .orElseThrow(() -> new EntityNotFoundException("Parceiro não encontrado para o usuário autenticado."));

        parceiro.setLeitosUti(dto.leitosUti());
        parceiro.setLeitosEnfermaria(dto.leitosEnfermaria());
        parceiro.setMedicosPlantao(dto.medicosPlantao());
        parceiro.setAceitandoEmergencias(dto.aceitandoEmergencias());

        parceiroRepository.save(parceiro);
    }
}