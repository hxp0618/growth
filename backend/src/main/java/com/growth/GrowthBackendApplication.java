package com.growth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Growth Backend 主启动类
 *
 * @author growth
 * @since 1.0
 */
@Slf4j
@SpringBootApplication
public class GrowthBackendApplication {

    public static void main(String[] args) throws UnknownHostException {
        ConfigurableApplicationContext application = SpringApplication.run(GrowthBackendApplication.class, args);
        Environment env = application.getEnvironment();

        String ip = InetAddress.getLocalHost().getHostAddress();
        String port = env.getProperty("server.port");
        String path = env.getProperty("server.servlet.context-path", "");

        log.info("""
                        
                        ----------------------------------------------------------
                        \t\
                        Application '{}' is running! Access URLs:
                        \t\
                        Local: \t\thttp://localhost:{}{}
                        \t\
                        External: \thttp://{}:{}{}
                        \t\
                        Profile(s): \t{}
                        \t\
                        API Doc: \thttp://localhost:{}{}/doc.html
                        ----------------------------------------------------------""",
                env.getProperty("spring.application.name"),
                port,
                path,
                ip,
                port,
                path,
                env.getActiveProfiles(),
                port,
                path);
    }
}
