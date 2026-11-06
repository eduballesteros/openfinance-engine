package es.eduballesteros.openfinance;

import org.springframework.boot.SpringApplication;

public class TestOpenfinanceEngineApplication {

	public static void main(String[] args) {
		SpringApplication.from(OpenfinanceEngineApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
